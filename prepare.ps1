param([switch]$debug)

cd $PSScriptRoot

function which-pattern{
  param([array]$items)
  $pattern = '';
  $items | % {
    if ($pattern -eq '') { $pattern = '(' }
    else { $pattern += '|' }
    $pattern += '(?:' + $_ + ')';
  }
  $pattern += ')';
  return $pattern;
}

# ------------------------------------------------------------
# r1: regex for swap min files
# ------------------------------------------------------------
$pattern = which-pattern 'natori(?:\.min)?\.js', 'app(?:\.min)?\.js', 'app(?:\.min)?\.css'
$pattern += '(?:\?t=([a-z0-9]+))?';
$r1 = new-object regex($pattern, [text.regularexpressions.regexoptions]::ignorecase)

# ------------------------------------------------------------
# r2: regex for update timestamps
# ------------------------------------------------------------
$pattern = which-pattern 'natori(?:\.min)?\.js', 'app(?:\.min)?\.js', 'app(?:\.min)?\.css', 'images/app\.ico', 'images/twittercard\.jpg', 'images/tile-square70x70\.png', 'images/tile-square150x150\.png'
$pattern += '(?:\?t=([a-z0-9]+))?';
$r2 = new-object regex($pattern, [text.regularexpressions.regexoptions]::ignorecase)

# ------------------------------------------------------------
# updating
# ------------------------------------------------------------
rm index.html.swap
type index.html | %{
  $replaced = $_
  $matched = $false
  if ($r1.ismatch($replaced)) {
    $matched = $true
    $replaced = $r1.replace($replaced, {
      param($m)
      if ($debug -and $m.groups[1].value.contains('.min')) {
        return $m.groups[1].value.replace('.min', '');
      }
      elseif (-not $debug -and -not $m.groups[1].value.contains('.min')) {
        $li = $m.groups[1].value.lastindexof('.');
        return $m.groups[1].value.insert($li, '.min');
      }
      return $m.value;
    });
  }
  if (-not $debug -and $r2.ismatch($replaced)) {
    $matched = $true
    $replaced = $r2.replace($replaced, {
      param($m)
      $t = (ls -literalpath ($m.groups[1].value))[0].lastwritetime.ticks
      '{0}?t={1}' -f ($m.groups[1].value), $t
    });
  }

  $replaced | out-file index.html.swap -encoding utf8 -append
  if ($matched -and $replaced -ne $_) {
    write-host "-" $_ -foreground white -background red
    write-host "+" $replaced -foreground red -background yellow
  }
  elseif ($matched) {
    write-host "=" $replaced -foreground white -background gray
  }
}
mv index.html index.html.swap2
mv index.html.swap index.html
mv index.html.swap2 index.html.swap
write-host 'Press any key to exit...'
[void]$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")