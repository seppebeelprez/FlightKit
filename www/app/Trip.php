<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trip extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'airport', 'user_id',
    ];

    public $timestamps = false;
    protected $hidden = ['pivot'];

    /**
     * Many-to-Many.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * An flight is owned by multiple user
     */
    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('trip_id', 'user_id');
    }
}
